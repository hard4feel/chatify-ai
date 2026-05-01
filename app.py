import streamlit as st
import os
from groq import Groq

# 1. ПОДКЛЮЧАЕМ ТВОЙ CSS
def local_css(file_name):
    with open(file_name) as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

# Проверяем, есть ли файл стиля в папке static (как у тебя в GitHub)
if os.path.exists("static/style.css"):
    local_css("static/style.css")
else:
    st.warning("Бро, не вижу static/style.css, проверь пути!")

# 2. СЕКРЕТКИ (Берем из настроек Streamlit Cloud)
try:
    client_groq = Groq(api_key=st.secrets["GROQ_API_KEY"])
    LOGIN_USER = st.secrets["LOGIN_USER"]
    LOGIN_PASSWORD = st.secrets["LOGIN_PASSWORD"]
except Exception as e:
    st.error("Настрой Secrets в Streamlit! Нужны GROQ_API_KEY, LOGIN_USER, LOGIN_PASSWORD")
    st.stop()

# 3. ЛОГИКА ВХОДА (Оставляем твою структуру)
if "auth" not in st.session_state:
    st.session_state.auth = False

if not st.session_state.auth:
    # Здесь можно добавить твое лого из assets
    # st.image("assets/logo.png", width=100) 
    st.title("LUVVU SYSTEM")
    u = st.text_input("LOGIN")
    p = st.text_input("PASSWORD", type="password")
    if st.button("ENTER"):
        if u == LOGIN_USER and p == LOGIN_PASSWORD:
            st.session_state.auth = True
            st.rerun()
    st.stop()

# 4. ОСНОВНОЙ КОНТЕНТ (Твой мудрый бро)
st.title("Luvvu Intelligence")

if "messages" not in st.session_state:
    st.session_state.messages = []

# Отображение чата
for m in st.session_state.messages:
    with st.chat_message(m["role"]):
        st.markdown(m["content"])

if prompt := st.chat_input("На связи..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        # Наш промпт
        SYSTEM_PROMPT = "Ты — Luvvu AI, мудрый бро. Говоришь четко, по делу, поддерживаешь и решаешь вопросы."
        
        res = client_groq.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": SYSTEM_PROMPT}] + st.session_state.messages[-10:]
        )
        answer = res.choices[0].message.content
        st.markdown(answer)
        st.session_state.messages.append({"role": "assistant", "content": answer})