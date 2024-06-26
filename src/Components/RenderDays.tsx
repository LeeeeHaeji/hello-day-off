import styled from "styled-components";

export default function RenderDays() {
  const days = [];
  const date = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 7; i++) {
    days.push(<li key={i}>{date[i]}</li>);
  }

  return <DaysRow>{days}</DaysRow>;
}

const DaysRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  li {
    width: 100%;
    text-align: center;
    background: ${(props) => props.theme.accentBgColor};
    font-size: 1.6rem;

    border-radius: 10px;
    padding: 10px;

    @media (max-width: 512px) {
      padding: 10px 0;
    }
  }
`;
