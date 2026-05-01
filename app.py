import os
import streamlit as st
from groq import Groq
from streamlit_react import render_react  # если не работает — удали эту строку

# === СЕКРЕТЫ ИЗ STREAMLIT CLOUD ===
GROQ_API_KEY = st.secrets["GROQ_API_KEY"]
VALID_LOGIN = st.secrets["LOGIN"]
VALID_PASSWORD = st.secrets["PASSWORD"]

# === ИНИЦИАЛИЗАЦИЯ GROQ ===
client = Groq(api_key=GROQ_API_KEY)

# === ЕСЛИ ХОЧЕШЬ ПОЛНОСТЬЮ ОТДАВАТЬ РЕАКТ-ПРИЛОЖЕНИЕ ЧЕРЕЗ STREAMLIT ===
# Но это сложно. Проще оставить как есть (React + Flask).

# === ПРОСТОЙ ВАРИАНТ: Streamlit как прослойка для API ===
# Твой React-фронтенд будет обращаться к этому API
# Но для этого нужно переписать запросы в React

st.set_page_config(page_title="luvvu AI", page_icon="💛")

st.title("luvvu — тёплый AI")

# Проверка логина/пароля
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if not st.session_state.logged_in:
    login = st.text_input("Логин")
    password = st.text_input("Пароль", type="password")
    if st.button("Войти"):
        if login == VALID_LOGIN and password == VALID_PASSWORD:
            st.session_state.logged_in = True
            st.rerun()
        else:
            st.error("Неверный логин или пароль")
    st.stop()

# Чат
if "messages" not in st.session_state:
    st.session_state.messages = []

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

if prompt := st.chat_input("Спроси меня..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        with st.spinner("Думаю..."):
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
            )
            reply = completion.choices[0].message.content
            st.markdown(reply)
            st.session_state.messages.append({"role": "assistant", "content": reply})