import "../css/styles.css";

document.addEventListener("DOMContentLoaded", () => {
  // Состояние калькулятора
  let expression = "0";

  // DOM-элементы
  const display = document.getElementById("display");
  const buttons = document.querySelectorAll(".buttons button");

  // Проверка на наличие элементов
  if (!display || !buttons.length) {
    console.error("Required DOM elements not found");
    return;
  }

  // Обновление дисплея
  function updateDisplay() {
    display.textContent = expression || "0";
  }

  // Проверка возможности добавления цифры или точки
  function canAddDigitOrDot(expr, symbol) {
    if (symbol === ".") {
      const lastNumber = expr.split(/[\+\-\*\/]/).pop();
      return !lastNumber.includes(".");
    }
    if (expr === "0" && /\d/.test(symbol)) {
      return true;
    }
    return true;
  }

  // Вычисление выражения с помощью eval
  function computeResult(expr) {
    try {
      // Заменяем символы для корректного вычисления
      let sanitizedExpr = expr.replace(/÷/g, "/").replace(/×/g, "*");
      // Базовая проверка на безопасность: разрешаем только цифры, операторы и точку
      if (!/^[0-9+\-*/.\s]+$/.test(sanitizedExpr)) {
        throw new Error("Invalid expression");
      }
      const result = eval(sanitizedExpr);
      if (!isFinite(result)) return "Error";
      return Number(result)
        .toFixed(8)
        .replace(/\.?0+$/, "");
    } catch (e) {
      console.error("Calculation error:", e);
      return "Error";
    }
  }

  // Обработка операций
  function handleOperation(action, expr) {
    try {
      if (action === "percent") {
        const lastNumber = expr.split(/[\+\-\*\/]/).pop();
        return expr.slice(0, -lastNumber.length) + Number(lastNumber) / 100;
      }
      return expr;
    } catch (e) {
      console.error("Operation error:", e);
      return "Error";
    }
  }

  // Обработчик кнопок
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const val = event.currentTarget.dataset.value;
      const action = event.currentTarget.dataset.action;

      // Очистка
      if (action === "clear") {
        expression = "0";
        updateDisplay();
        return;
      }

      // Вычисление
      if (val === "=") {
        const result = computeResult(expression);
        expression = result;
        updateDisplay();
        return;
      }

      // Процент
      if (action === "percent") {
        expression = handleOperation(action, expression);
        updateDisplay();
        return;
      }

      // Цифры и точка
      if (/\d/.test(val) || val === ".") {
        if (canAddDigitOrDot(expression, val)) {
          if (expression === "0" && val !== ".") {
            expression = val;
          } else {
            expression += val;
          }
          updateDisplay();
        }
        return;
      }

      // Операторы
      if (["+", "-", "*", "/"].includes(val)) {
        if (expression && !/[+\-*/]$/.test(expression)) {
          expression += val;
          updateDisplay();
        }
        return;
      }
    });
  });

  // Клавиатурный ввод
  document.addEventListener("keydown", (event) => {
    const key = event.key;
    const keyMap = {
      Enter: "=",
      Escape: "clear",
      "/": "/",
      "*": "*",
      "+": "+",
      "-": "-",
      ".": ".",
      "%": "percent",
    };
    if (/\d/.test(key)) {
      document.querySelector(`[data-value="${key}"]`)?.click();
    } else if (keyMap[key]) {
      const selector = keyMap[key].startsWith("percent")
        ? `[data-action="${keyMap[key]}"]`
        : `[data-value="${keyMap[key]}"],[data-action="${keyMap[key]}"]`;
      document.querySelector(selector)?.click();
    }
  });

  // Инициализация
  updateDisplay();
});
