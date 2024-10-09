import styled from "styled-components"

type SwitchProps = {
  value: boolean
  onChange?: (newValue: boolean) => void
  name?: string
}

const CheckboxSwitch = styled.input`
  --height: 1.6rem;
  --width: 2.6rem;
  --tab-size: 1.3rem;
  appearance: none;
  display: inline-block;
  position: relative;
  width: var(--width);
  height: var(--height);
  border-radius: calc(var(--height));
  background: #222;
  box-shadow: 0 1px 3px #0003 inset;
  vertical-align: middle;
  padding: var(--pad);
  margin: 0;
  margin-left: 0.6em;
  transition: background-color 0.2s ease;

  &:checked {
    background: #358000;
  }

  &:after {
    content: "";
    display: block;
    width: var(--tab-size);
    height: var(--tab-size);
    border-radius: calc(var(--tab-size)); 
    background: #444;
    position: absolute;
    top: 2px;
    border: 1px solid #555;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
  }

  &:checked:after {
    transform: translate(calc(var(--width) - var(--tab-size) - 4px));
    background-color: #eee;
    border-color: #ddd;
  }

`

export const Switch =  (props: SwitchProps) => {
  return (
    <CheckboxSwitch type="checkbox" name={props.name}
      onChange={e => props.onChange?.(e.target.checked)}
    />
  )
}