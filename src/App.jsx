import { useEffect, useState } from "react";
import "./App.css";

const START_BALANCE = 2900;
const PIN = "1988";

const translations = {
  ru: {
    choose: "Выберите язык / Select Language",
    chooseText: "Пожалуйста, выберите язык для продолжения",
    continue: "Продолжить",
    pin: "Введите PIN-код",
    pinText: "Введите 4-значный PIN-код",
    wrongPin: "Неверный PIN-код",
    welcome: "Добро пожаловать!",
    welcomeText: "Вы успешно вошли в систему",
    main: "Главное меню",
    select: "Выберите операцию",
    balance: "Ваш баланс",
    check: "Проверить баланс",
    withdraw: "Снять деньги",
    deposit: "Пополнить счет",
    history: "История операций",
    exit: "Выход",
    depositTitle: "Пополнение счета",
    depositText: "Выберите или введите сумму",
    other: "Другая сумма:",
    depositBtn: "Пополнить счет",
    withdrawTitle: "Снятие денег",
    withdrawText: "Выберите или введите сумму",
    withdrawBtn: "Снять деньги",
    back: "Назад",
    noHistory: "История операций пуста",
    income: "Пополнение",
    expense: "Снятие",
    successDeposit: "Счет успешно пополнен",
    successWithdraw: "Деньги успешно сняты",
    notEnough: "Недостаточно средств",
  },

  kg: {
    choose: "Тилди тандаңыз / Select Language",
    chooseText: "Улантуу үчүн тилди тандаңыз",
    continue: "Улантуу",
    pin: "PIN-кодду киргизиңиз",
    pinText: "4 орундуу PIN-кодду киргизиңиз",
    wrongPin: "PIN-код туура эмес",
    welcome: "Кош келиңиз!",
    welcomeText: "Сиз системага ийгиликтүү кирдиңиз",
    main: "Башкы меню",
    select: "Операцияны тандаңыз",
    balance: "Сиздин балансыңыз",
    check: "Балансты текшерүү",
    withdraw: "Акча алуу",
    deposit: "Эсепти толуктоо",
    history: "Операциялар тарыхы",
    exit: "Чыгуу",
    depositTitle: "Эсепти толуктоо",
    depositText: "Сумманы тандаңыз же жазыңыз",
    other: "Башка сумма:",
    depositBtn: "Эсепти толуктоо",
    withdrawTitle: "Акча алуу",
    withdrawText: "Сумманы тандаңыз же жазыңыз",
    withdrawBtn: "Акча алуу",
    back: "Артка",
    noHistory: "Операциялар тарыхы бош",
    income: "Толуктоо",
    expense: "Акча алуу",
    successDeposit: "Эсеп ийгиликтүү толукталды",
    successWithdraw: "Акча ийгиликтүү алынды",
    notEnough: "Каражат жетишсиз",
  },

  en: {
    choose: "Select Language",
    chooseText: "Please select a language to continue",
    continue: "Continue",
    pin: "Enter PIN code",
    pinText: "Enter your 4-digit PIN code",
    wrongPin: "Incorrect PIN code",
    welcome: "Welcome!",
    welcomeText: "You have successfully logged in",
    main: "Main Menu",
    select: "Select an operation",
    balance: "Your balance",
    check: "Check balance",
    withdraw: "Withdraw money",
    deposit: "Top up account",
    history: "Transaction history",
    exit: "Exit",
    depositTitle: "Top up account",
    depositText: "Choose or enter an amount",
    other: "Other amount:",
    depositBtn: "Top up",
    withdrawTitle: "Withdraw money",
    withdrawText: "Choose or enter an amount",
    withdrawBtn: "Withdraw",
    back: "Back",
    noHistory: "Transaction history is empty",
    income: "Top up",
    expense: "Withdrawal",
    successDeposit: "Account successfully topped up",
    successWithdraw: "Money successfully withdrawn",
    notEnough: "Insufficient funds",
  },
};

function App() {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || ""
  );

  const [screen, setScreen] = useState(
    localStorage.getItem("language") ? "pin" : "language"
  );

  const [pin, setPin] = useState("");

  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("balance");

    if (saved !== null) {
      return Number(saved);
    }

    localStorage.setItem("balance", START_BALANCE);
    return START_BALANCE;
  });

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("history")) || [];
    } catch {
      return [];
    }
  });

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const t = translations[language || "ru"];

  // Балансты сактоо
  useEffect(() => {
    localStorage.setItem("balance", balance);
  }, [balance]);

  // Историяны сактоо
  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  // Тилди сактоо
  useEffect(() => {
    if (language) {
      localStorage.setItem("language", language);
    }
  }, [language]);

  // Тил тандоо
  const chooseLanguage = (lang) => {
    setLanguage(lang);
  };

  const continueLanguage = () => {
    if (!language) return;
    setScreen("pin");
  };

  // PIN
  const addPinNumber = (number) => {
    if (pin.length < 4) {
      setPin((prev) => prev + number);
    }
  };

  const removePin = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const checkPin = () => {
    if (pin === PIN) {
      setPin("");
      setScreen("welcome");

      setTimeout(() => {
        setScreen("main");
      }, 1300);
    } else {
      setMessage(t.wrongPin);
      setPin("");

      setTimeout(() => {
        setMessage("");
      }, 1500);
    }
  };

  // Сумманы кошуу
  const depositMoney = () => {
    const value = Number(amount);

    if (!value || value <= 0) return;

    const newBalance = balance + value;

    setBalance(newBalance);

    const operation = {
      id: Date.now(),
      type: "deposit",
      amount: value,
      balance: newBalance,
      date: new Date().toLocaleString(),
    };

    setHistory((prev) => [operation, ...prev]);

    setAmount("");
    setMessage(t.successDeposit);

    setTimeout(() => {
      setMessage("");
      setScreen("main");
    }, 800);
  };

  // Акча алуу
  const withdrawMoney = () => {
    const value = Number(amount);

    if (!value || value <= 0) return;

    if (value > balance) {
      setMessage(t.notEnough);

      setTimeout(() => {
        setMessage("");
      }, 1500);

      return;
    }

    const newBalance = balance - value;

    setBalance(newBalance);

    const operation = {
      id: Date.now(),
      type: "withdraw",
      amount: value,
      balance: newBalance,
      date: new Date().toLocaleString(),
    };

    setHistory((prev) => [operation, ...prev]);

    setAmount("");
    setMessage(t.successWithdraw);

    setTimeout(() => {
      setMessage("");
      setScreen("main");
    }, 800);
  };

  // Чыгуу
  const logout = () => {
    setPin("");
    setScreen("pin");
  };

  // ---------------- LANGUAGE ----------------

  if (screen === "language") {
    return (
      <div className="app">
        <div className="card language-card">
          <div className="globe">🌍</div>

          <h1>{t.choose}</h1>

          <p>{t.chooseText}</p>

          <div className="languages">
            <button
              className={language === "ru" ? "selected" : ""}
              onClick={() => chooseLanguage("ru")}
            >
              🇷🇺
              <span>Русский</span>
            </button>

            <button
              className={language === "en" ? "selected" : ""}
              onClick={() => chooseLanguage("en")}
            >
              🇬🇧
              <span>English</span>
            </button>

            <button
              className={language === "kg" ? "selected" : ""}
              onClick={() => chooseLanguage("kg")}
            >
              🇰🇬
              <span>Кыргызча</span>
            </button>
          </div>

          <button className="gradient-btn" onClick={continueLanguage}>
            {t.continue}
            <span>→</span>
          </button>
        </div>
      </div>
    );
  }

  // ---------------- PIN ----------------

  if (screen === "pin") {
    return (
      <div className="app">
        <div className="card pin-card">
          <div className="lock">🔐</div>

          <h1>{t.pin}</h1>

          <p>{t.pinText}</p>

          <div className="pin-dots">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`pin-dot ${i < pin.length ? "filled" : ""}`}
              >
                {i < pin.length ? "●" : ""}
              </div>
            ))}
          </div>

          {message && <div className="error">{message}</div>}

          <div className="keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <button key={number} onClick={() => addPinNumber(String(number))}>
                {number}
              </button>
            ))}

            <button onClick={removePin}>⌫</button>

            <button onClick={() => addPinNumber("0")}>0</button>

            <button onClick={checkPin}>✓</button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- WELCOME ----------------

  if (screen === "welcome") {
    return (
      <div className="app">
        <div className="card welcome-card">
          <div className="success-icon">✓</div>

          <h1>{t.welcome}</h1>

          <p>{t.welcomeText}</p>

          <div className="loading-line"></div>
        </div>
      </div>
    );
  }



  if (screen === "main") {
    return (
      <div className="app">
        <div className="card main-card">
          <div className="header">
            <h1>{t.main}</h1>
            <p>{t.select}</p>
          </div>

          <div className="content">
            <div className="balance-box">
              <span>{t.balance}</span>
              <strong>{balance.toLocaleString()} ₽</strong>
            </div>

            <button
              className="menu-btn"
              onClick={() => setMessage(`${balance.toLocaleString()} $`)}
            >
              <span>💰 {t.check}</span>
              <b>→</b>
            </button>

            <button
              className="menu-btn"
              onClick={() => {
                setAmount("");
                setScreen("withdraw");
              }}
            >
              <span>💵 {t.withdraw}</span>
              <b>→</b>
            </button>

            <button
              className="menu-btn"
              onClick={() => {
                setAmount("");
                setScreen("deposit");
              }}
            >
              <span>💳 {t.deposit}</span>
              <b>→</b>
            </button>

            <button
              className="menu-btn"
              onClick={() => setScreen("history")}
            >
              <span>📊 {t.history}</span>
              <b>→</b>
            </button>

            {message && <div className="success-message">{message}</div>}

            <button className="exit-btn" onClick={logout}>
              <span>← {t.exit}</span>
              <b>→</b>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- DEPOSIT ----------------

  if (screen === "deposit") {
    return (
      <div className="app">
        <div className="card">
          <div className="header">
            <h1>{t.depositTitle}</h1>
            <p>{t.depositText}</p>
          </div>

          <div className="content">
            <div className="amount-grid">
              {[100, 500, 1000, 2000].map((value) => (
                <button
                  key={value}
                  onClick={() => setAmount(String(value))}
                >
                  {value.toLocaleString()} ₽
                </button>
              ))}
            </div>

            <label>{t.other}</label>

            <input
              className="amount-input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />

            <button className="green-btn" onClick={depositMoney}>
              {t.depositBtn}
              <span>→</span>
            </button>

            <button className="back-btn" onClick={() => setScreen("main")}>
              ← {t.back}
              <span>→</span>
            </button>

            {message && <div className="success-message">{message}</div>}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- WITHDRAW ----------------

  if (screen === "withdraw") {
    return (
      <div className="app">
        <div className="card">
          <div className="header">
            <h1>{t.withdrawTitle}</h1>
            <p>{t.withdrawText}</p>
          </div>

          <div className="content">
            <div className="current-balance">
              {t.balance}: <strong>{balance.toLocaleString()} ₽</strong>
            </div>

            <div className="amount-grid withdraw-grid">
              {[100, 500, 1000, 2000].map((value) => (
                <button
                  key={value}
                  onClick={() => setAmount(String(value))}
                >
                  {value.toLocaleString()} ₽
                </button>
              ))}
            </div>

            <label>{t.other}</label>

            <input
              className="amount-input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />

            <button className="red-btn" onClick={withdrawMoney}>
              {t.withdrawBtn}
              <span>→</span>
            </button>

            <button className="back-btn" onClick={() => setScreen("main")}>
              ← {t.back}
              <span>→</span>
            </button>

            {message && <div className="error">{message}</div>}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- HISTORY ----------------

  if (screen === "history") {
    return (
      <div className="app">
        <div className="card history-card">
          <div className="header">
            <h1>{t.history}</h1>
            <p>{t.select}</p>
          </div>

          <div className="content">
            <div className="history-balance">
              <span>{t.balance}</span>
              <strong>{balance.toLocaleString()} ₽</strong>
            </div>

            {history.length === 0 ? (
              <div className="empty-history">
                📭
                <p>{t.noHistory}</p>
              </div>
            ) : (
              <div className="history-list">
                {history.map((item) => (
                  <div className="history-item" key={item.id}>
                    <div
                      className={
                        item.type === "deposit"
                          ? "history-icon income"
                          : "history-icon expense"
                      }
                    >
                      {item.type === "deposit" ? "↓" : "↑"}
                    </div>

                    <div className="history-info">
                      <strong>
                        {item.type === "deposit"
                          ? t.income
                          : t.expense}
                      </strong>

                      <small>{item.date}</small>

                      <small>
                        {t.balance}: {item.balance.toLocaleString()} ₽
                      </small>
                    </div>

                    <strong
                      className={
                        item.type === "deposit"
                          ? "plus-money"
                          : "minus-money"
                      }
                    >
                      {item.type === "deposit" ? "+" : "-"}
                      {item.amount.toLocaleString()} ₽
                    </strong>
                  </div>
                ))}
              </div>
            )}

            <button className="back-btn" onClick={() => setScreen("main")}>
              ← {t.back}
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;