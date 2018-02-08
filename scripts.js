let greetingCounter = 1

const greetings = [
  "Hello",
  "こんにちは",
  "你好",
  "안녕하세요"
]

const u = "zach"
const d = "zerovolts"

document.addEventListener("DOMContentLoaded", () => {
  const greeting = document.getElementById("greeting")
  const e = document.getElementById("e")

  e.href = "mailto:" + u + "@" + d + ".com"

  setInterval(() => {
    greeting.className = "hidden"

    setTimeout(() => {
      greeting.className = ""
      greeting.innerHTML = greetings[greetingCounter]
      greetingCounter += 1

      if (greetingCounter > greetings.length - 1) {
        greetingCounter -= greetings.length
      }
    }, 500)
  }, 8000)
})
