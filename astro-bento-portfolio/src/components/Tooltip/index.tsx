import { type JSX, Show, createSignal } from "solid-js";

type Props = {
  children: JSX.Element;
};

function Tooltip(props: Props) {
  const [isVisible, setIsVisible] = createSignal(false);
  const [clickCount, setClickCount] = createSignal(0);

const messages = [
    "The first computer programmer was Ada Lovelace in the 1840s.",
    "The first computer virus was created in 1986 and called Brain.",
    "The term 'debugging' comes from removing a moth from a computer.",
    "The first electronic computer, ENIAC, weighed over 27 tons.",
    "Alan Turing is considered the father of computer science.",
    "Python is named after the British comedy group Monty Python.",
    "The first hard drive could store just 5MB of data.",
    "The first email was sent in 1971 by Ray Tomlinson.",
    "The first website is still online and was created in 1991 by Tim Berners-Lee.",
    "Moore's Law predicts that computer processing power doubles every two years.",
    "The first 1GB hard drive was introduced in 1980 and weighed 550 pounds.",
    "The QWERTY keyboard layout was designed in 1873 for typewriters.",
    "The term 'cookie' in computing comes from 'magic cookies' in Unix programming.",
    "The first smartphone, IBM Simon, was released in 1994.",
    "ASCII stands for 'American Standard Code for Information Interchange.'",
    "Java was originally named 'Oak' after a tree outside James Gosling's office.",
    "HTML stands for 'HyperText Markup Language.'",
    "The first gaming console, the Magnavox Odyssey, was released in 1972.",
    "Linux, an open-source OS, was created by Linus Torvalds in 1991."
];


  const currentMessage = () => {
    const count = clickCount();
    return messages[count % messages.length];
  };

  return (
    <div class="relative inline-block">
      <div
        onMouseDown={() => {
          setIsVisible(!isVisible());
          if (isVisible()) {
            setClickCount((count) => count + 1);
          }
        }}
        onMouseUp={() => {
          setIsVisible(false);
        }}
        onTouchStart={() => {
          setIsVisible(!isVisible());
          if (isVisible()) {
            setClickCount((count) => count + 1);
          }
        }}
        onTouchEnd={() => {
          setIsVisible(false);
        }}
      >
        {props.children}
      </div>

      <Show when={isVisible()}>
        <div class="absolute left-1/2 -translate-x-1/2 -translate-y-24 mt-1 w-auto max-h-[70px] p-2 bg-black text-white text-center rounded-lg z-10 shadow-custom shadow-primary-500 border border-primary-500 whitespace-normal after:content-[''] after:block after:rotate-45 after:w-4 after:h-4 after:shadow-custom after:shadow-primary-500 after:absolute after:-bottom-2 after:-translate-x-1/2 after:left-1/2 after:bg-black after:z-20">
          <p class="w-max">{currentMessage()}</p>
        </div>
      </Show>
    </div>
  );
}

export default Tooltip;
