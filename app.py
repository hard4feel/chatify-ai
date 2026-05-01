import streamlit as st
import os
from groq import Groq
from utils import * # Импортируем твои утилиты, если они нужны

# --- ЗАГРУЗКА ТВОЕГО ДИЗАЙНА ---
def load_css(file_name):
    if os.path.exists(file_name):
        with open(file_name, "r", encoding="utf-8") as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

# Применяем твой стиль из папки static
load_css("static/style.css")

# --- СЕКРЕТЫ (Для Streamlit Cloud) ---
try:
    GROQ_KEY = st.secrets["GROQ_API_KEY"]
    L_USER = st.secrets["LOGIN_USER"]
    L_PWD = st.secrets["LOGIN_PASSWORD"]
    client = Groq(api_key=GROQ_KEY)
except Exception as e:
    st.error("Бро, проверь Secrets в настройках Streamlit Cloud! Нужны: GROQ_API_KEY, LOGIN_USER, LOGIN_PASSWORD")
    st.stop()

# --- ЛОГИКА ВХОДА ---
if "auth" not in st.session_state:
    st.session_state.auth = False

if not st.session_state.auth:
    st.markdown('<div class="login-container">', unsafe_allow_html=True)
    st.title("🌑 LUVVU OS LOGIN")
    user_input = st.text_input("ID")
    pass_input = st.text_input("KEY", type="password")
    if st.button("INITIALIZE"):
        if user_input == L_USER and pass_input == L_PWD:
            st.session_state.auth = True
            st.rerun()
        else:
            st.error("ACCESS DENIED")
    st.markdown('</div>', unsafe_allow_html=True)
    st.stop()

# --- ОСНОВНОЙ ИНТЕРФЕЙС ---
st.title("🌑 Luvvu Intelligence")

if "messages" not in st.session_state:
    st.session_state.messages = []

# Вывод сообщений (используем стандартные чат-элементы, которые подхватят твой CSS)
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

# Поле ввода
if prompt := st.chat_input("На связи, бро..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

    with st.chat_message("assistant"):
        # Промпт Мудрого Бро
        SYSTEM_PROMPT = (
            "Ты — Luvvu AI, бро и цифровой ментор. Твой стиль — уверенный, лаконичный, пацанский, но глубоко мудрый. "
            "Ты общаешься на 'ты'. Ты не робот, ты решала. Даешь жесткие и мудрые советы. "
            "Ценишь стиль 'old money', дисциплину и бренд Erryssence."
        )
        
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "system", "content": SYSTEM_PROMPT}] + st.session_state.messages[-10:]
            )
            answer = response.choices[0].message.content
            st.write(answer)
            st.session_state.messages.append({"role": "assistant", "content": answer})
        except Exception as e:
            st.error("Связь с ядром прервана. Проверь API ключ.")