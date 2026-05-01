import streamlit as st
import os
from groq import Groq

# 1. ЗАГРУЗКА ТВОЕГО ДИЗАЙНА (Исправляем пути)
def load_css(file_path):
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)
    else:
        # Если файл не найден, выведем инфо для отладки
        st.sidebar.error(f"Файл {file_path} не найден!")

# Пытаемся подгрузить стиль. У тебя на гитхабе он в static/style.css
load_css("static/style.css")

# 2. ИМПОРТ ТВОИХ УТИЛИТ (С учетом регистра)
try:
    import Utils  # Импорт именно с большой буквы, как в репозитории
except ImportError:
    pass # Если не критично, просто идем дальше

# 3. СЕКРЕТЫ (Берем напрямую из Streamlit Cloud)
try:
    client = Groq(api_key=st.secrets["GROQ_API_KEY"])
    L_USER = st.secrets["LOGIN_USER"]
    L_PWD = st.secrets["LOGIN_PASSWORD"]
except Exception as e:
    st.error("Настрой Secrets: GROQ_API_KEY, LOGIN_USER, LOGIN_PASSWORD")
    st.stop()

# 4. АВТОРИЗАЦИЯ
if "auth" not in st.session_state:
    st.session_state.auth = False

if not st.session_state.auth:
    st.title("🌑 LUVVU OS INITIALIZATION")
    u = st.text_input("USER ID")
    p = st.text_input("ACCESS KEY", type="password")
    if st.button("CONNECT"):
        if u == L_USER and p == L_PWD:
            st.session_state.auth = True
            st.rerun()
        else:
            st.error("ACCESS DENIED")
    st.stop()

# 5. ИНТЕРФЕЙС И ГРОК (Твой мудрый бро)
st.title("🌑 Luvvu Intelligence")

if "messages" not in st.session_state:
    st.session_state.messages = []

for m in st.session_state.messages:
    with st.chat_message(m["role"]):
        st.write(m["content"])

if prompt := st.chat_input("На связи, бро..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

    with st.chat_message("assistant"):
        # Промпт Мудрого Бро
        SYSTEM_PROMPT = (
            "Ты — Luvvu AI, бро и цифровой ментор. Твой стиль — уверенный, лаконичный, пацанский, но мудрый. "
            "Ты общаешься на 'ты'. Не используй клише. Ты решала. "
            "Ценишь стиль 'old money', дисциплину и бренд Erryssence."
        )
        
        try:
            chat_completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "system", "content": SYSTEM_PROMPT}] + st.session_state.messages[-10:]
            )
            response = chat_completion.choices[0].message.content
            st.write(response)
            st.session_state.messages.append({"role": "assistant", "content": response})
        except Exception as e:
            st.error(f"Ошибка ядра: {e}")