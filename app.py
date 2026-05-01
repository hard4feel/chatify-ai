import streamlit as st
from groq import Groq

# 1. ЗАГРУЗКА СЕКРЕТОВ (Streamlit Cloud)
try:
    GROQ_API_KEY = st.secrets["GROQ_API_KEY"]
    LOGIN_USER = st.secrets["LOGIN_USER"]
    LOGIN_PASSWORD = st.secrets["LOGIN_PASSWORD"]
except:
    st.error("Критическая ошибка: Настрой Secrets в Streamlit Cloud!")
    st.stop()

client_groq = Groq(api_key=GROQ_API_KEY)

# 2. ДИЗАЙН LUVVU (Minimalist Dark)
st.set_page_config(page_title="Luvvu OS", page_icon="🌑", layout="wide")

st.markdown("""
    <style>
    .stApp { background-color: #080808; color: #E0E0E0; }
    [data-testid="stSidebar"] { background-color: #0F0F0F; border-right: 1px solid #222; }
    .stButton>button {
        width: 100%; border-radius: 2px; background-color: #121212; color: #fff;
        border: 1px solid #333; transition: 0.4s; text-transform: uppercase; letter-spacing: 1px;
    }
    .stButton>button:hover { border-color: #fff; background-color: #1A1A1A; transform: translateY(-2px); }
    .stChatInput { border-top: 1px solid #222 !important; }
    </style>
""", unsafe_allow_html=True)

# 3. СИСТЕМА ДОСТУПА
if "auth" not in st.session_state:
    st.session_state.auth = False
if "page" not in st.session_state:
    st.session_state.page = "chat"

if not st.session_state.auth:
    st.title("🌑 LUVVU OS / INITIALIZATION")
    col1, col2 = st.columns(2)
    with col1: u = st.text_input("USER ID")
    with col2: p = st.text_input("ACCESS KEY", type="password")
    
    if st.button("CONNECT"):
        if u == LOGIN_USER and p == LOGIN_PASSWORD:
            st.session_state.auth = True
            st.rerun()
        else:
            st.error("ACCESS DENIED. WRONG KEY.")
    st.stop()

# 4. SIDEBAR
with st.sidebar:
    st.title("LUVVU OS")
    st.caption("v1.0.4 - Built for Erryssence")
    if st.button("🌑 Intelligence"): st.session_state.page = "chat"
    if st.button("💎 Business"): st.session_state.page = "wip"
    if st.button("🔗 Connect"): st.session_state.page = "wip"
    st.write("---")
    if st.button("RESET MEMORY"):
        st.session_state.messages = []
        st.rerun()

# 5. СТРАНИЦЫ
if st.session_state.page == "chat":
    st.title("🌑 Luvvu Intelligence")
    
    if "messages" not in st.session_state:
        st.session_state.messages = []

    for m in st.session_state.messages:
        with st.chat_message(m["role"]):
            st.markdown(m["content"])

    if prompt := st.chat_input("На связи, бро..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            # ТОТ САМЫЙ ПРОМПТ ДЛЯ ГРОКА
            SYSTEM_PROMPT = (
                "Ты — Luvvu AI, бро и цифровой ментор. Твой стиль — уверенный, лаконичный, пацанский, но при этом глубоко мудрый. "
                "Ты общаешься на 'ты', как близкий друг (бро). Ты не используешь стандартные фразы роботов типа 'Чем я могу вам помочь?'. "
                "Ты решала. Если у бро проблема, ты не жалеешь его, а даешь жесткий, мудрый совет, который заставляет действовать. "
                "Ты ценишь эстетику Erryssence, стиль 'old money' и дисциплину. "
                "Твой юмор тонкий, твоя поддержка — настоящая. Если бро говорит 'мне плохо', ты отвечаешь как старший брат: "
                "спокойно, по делу и с верой в него."
            )

            try:
                # Берем последние 15 сообщений для контекста
                context = [{"role": "system", "content": SYSTEM_PROMPT}] + st.session_state.messages[-15:]
                
                res = client_groq.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=context,
                    temperature=0.85 # Немного больше свободы для "характера"
                )
                answer = res.choices[0].message.content
                st.markdown(answer)
                st.session_state.messages.append({"role": "assistant", "content": answer})
            except Exception as e:
                st.error("Ошибка связи с ядром. Проверь API Ключ.")

elif st.session_state.page == "wip":
    st.title("🏗️ Module: " + st.session_state.page.upper())
    st.image("https://raw.githubusercontent.com/hard4feel/chatify-ai/main/watermarked_img_2022433929113411874.png")
    st.info("Проектируем архитектуру. Скоро здесь будет мощь.")
    if st.button("BACK TO BASE"):
        st.session_state.page = "chat"
        st.rerun()