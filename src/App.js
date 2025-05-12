import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './redux/slides/counterSlide'

function App() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  const StyledButton = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${props => props.$primary ? "#BF4F74" : "white"};
  color: ${props => props.$primary ? "white" : "#BF4F74"};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #BF4F74;
  border-radius: 3px;
`;

  return (
    <div>
      <div>
        <StyledButton
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </StyledButton>
        <span>{count}</span>
        <StyledButton
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </StyledButton>
      </div>
    </div>
  )
}

export default App