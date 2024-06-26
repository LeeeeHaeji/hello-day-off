import React, { useState } from "react";
import { useRecoilState } from "recoil";

import styled from "styled-components";
import { EmployeeData } from "@/src/type";
import { inputDataAtom } from "../Recoil/inputDataAtom";
import deleteBtn from "../assets/images/delete.png";

interface InputDataProps {
  updateCurrentDate: (newDate: string) => void;
  updateEmployees: (
    updateFunction: (prevEmployees: EmployeeData[]) => EmployeeData[]
  ) => void;
}

export default function InputData({
  updateCurrentDate,
  updateEmployees,
}: InputDataProps) {
  const [employeeName, setEmployeeName] = useState("");

  const [inputData, setInputData] = useRecoilState(inputDataAtom);
  const { currentDate, employees, dayOffNum, dayOffMax } = inputData;

  const [dateErrorMsg, setDateErrorMsg] = useState("");
  const [dayOffNumErrorMsg, setDayOffNumErrorMsg] = useState("");
  const [dayOffMaxErrorMsg, setDayOffMaxErrorMsg] = useState("");

  const setDayOffNum = (newNum: string) => {
    setInputData({ ...inputData, dayOffNum: newNum });
  };

  const setDayOffMax = (newMax: string) => {
    setInputData({ ...inputData, dayOffMax: newMax });
  };

  const updateEmployeeName = () => {
    const newEmployee: EmployeeData = {
      name: employeeName,
      day_off: [],
      fix_day_off: [],
      random_day_off: [],
      bg_color: generateRandomColor(),
    };
    updateEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    setEmployeeName("");
  };

  const deleteEmployeeName = (
    employeeNameToDelete: string,
    indexToDelete: number
  ) => {
    updateEmployees((prevEmployees) =>
      prevEmployees.filter(
        (employee, index) =>
          employee.name !== employeeNameToDelete || index !== indexToDelete
      )
    );
  };

  const getTotalDaysInMonth = (dateString: string) => {
    const [year, month] = dateString.split("-").map(Number);
    return new Date(year, month, 0).getDate();
  };

  const fillRandomDayOffs = () => {
    const totalDays = getTotalDaysInMonth(currentDate);
    let dayOffAllocation = new Array(totalDays).fill(0);

    employees.forEach((employee) => {
      employee.day_off.forEach((dayOff) => {
        const day = parseInt(dayOff) - 1;
        if (day >= 0 && day < totalDays) {
          dayOffAllocation[day]++;
        }
      });
    });

    updateEmployees((prevEmployees) =>
      prevEmployees.map((employee) => {
        let currentDayOffs = [...employee.fix_day_off];
        const dayInterval = Math.ceil(totalDays / parseInt(dayOffNum)) - 2;
        let randomDayOffs = [];
        const maxRandomDays = parseInt(dayOffNum) - employee.fix_day_off.length;

        while (randomDayOffs.length < maxRandomDays) {
          let attempts = 0;
          let added = false;

          while (!added && attempts < totalDays * 2) {
            const randomDay = Math.floor(Math.random() * totalDays) + 1;
            if (
              dayOffAllocation[randomDay - 1] < parseInt(dayOffMax) &&
              isValidDayOff(randomDay, currentDayOffs, dayInterval) &&
              !currentDayOffs.includes(randomDay.toString())
            ) {
              randomDayOffs.push(randomDay.toString());
              currentDayOffs.push(randomDay.toString());
              dayOffAllocation[randomDay - 1]++;
              added = true;
            }
            attempts++;
          }

          if (!added) {
            // 모든 시도 후에도 새로운 휴무일을 추가할 수 없다면 루프를 종료합니다.

            break;
          }
        }

        return {
          ...employee,
          day_off: [...employee.fix_day_off, ...randomDayOffs].sort(
            (a, b) => parseInt(a) - parseInt(b)
          ),
          random_day_off: randomDayOffs.sort(
            (a, b) => parseInt(a) - parseInt(b)
          ),
        };
      })
    );
  };

  const isValidDayOff = (
    day: number,
    allDayOffs: string[],
    dayInterval: number
  ) => {
    return allDayOffs.every(
      (off) => Math.abs(day - parseInt(off)) >= dayInterval
    );
  };

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCurrentDate(e.target.value);
  };

  const handleEmployeeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeName(e.target.value);
  };

  const handleDayOffNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDayOffNum(e.target.value);
  };
  const handleDayOffMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDayOffMax(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;

    if (!currentDate) {
      setDateErrorMsg("* 필수 선택 값 입니다.");
      hasError = true;
    } else {
      setDateErrorMsg("");
    }

    if (!dayOffNum) {
      setDayOffNumErrorMsg("* 필수 입력 값 입니다.");
      hasError = true;
    } else {
      setDayOffNumErrorMsg("");
    }

    if (!dayOffMax) {
      setDayOffMaxErrorMsg("* 필수 입력 값 입니다.");
      hasError = true;
    } else {
      setDayOffMaxErrorMsg("");
    }

    if (!hasError) {
      fillRandomDayOffs();
    }
  };

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  };

  return (
    <FormData onSubmit={handleSubmit}>
      <Data>
        <label htmlFor="year-month">
          휴무 스케쥴을 제작할 년도와 월을 선택하세요.
        </label>
        <input
          type="month"
          id="year-month"
          value={currentDate}
          onChange={handleDate}
        />
        {dateErrorMsg && <p className="errorMsg">{dateErrorMsg}</p>}
      </Data>
      <DataWrap>
        <Data>
          <label htmlFor="day-off-num">1인 월 휴무 개수를 입력해주세요.</label>
          <input
            type="number"
            id="day-off-num"
            value={dayOffNum}
            onChange={handleDayOffNum}
          />
          {dayOffNumErrorMsg && <p className="errorMsg">{dayOffNumErrorMsg}</p>}
        </Data>

        <Data>
          <label htmlFor="day-off-max">
            하루에 최대 몇명까지 휴무가 가능한가요?
          </label>
          <input
            type="number"
            id="day-off-max"
            value={dayOffMax}
            onChange={handleDayOffMax}
          />
          {dayOffMaxErrorMsg && <p className="errorMsg">{dayOffMaxErrorMsg}</p>}
        </Data>
      </DataWrap>
      <Data>
        <label htmlFor="employee-name">
          휴무 일정을 배정할 직원을 작성해 주세요.
        </label>
        <div className="add-employee">
          <input
            type="text"
            id="employee-name"
            value={employeeName}
            onChange={handleEmployeeName}
          />

          <button
            type="button"
            className="add button"
            onClick={updateEmployeeName}
          >
            추가
          </button>
        </div>
        <EmployeeList>
          <p className="list-name">직원 목록:</p>
          {employees.length > 0 && (
            <ul>
              {employees.map((employee, index) => (
                <EmployeeListItem
                  key={`${employee.name}-${index}`}
                  bg_color={employee.bg_color}
                >
                  <p>{employee.name}</p>
                  <button
                    type="button"
                    onClick={() => deleteEmployeeName(employee.name, index)}
                  >
                    <img src={deleteBtn} alt="" />
                  </button>
                </EmployeeListItem>
              ))}
            </ul>
          )}
        </EmployeeList>
      </Data>

      <button type="submit" className="submit button">
        휴무 스케줄 랜덤 생성하기
      </button>
    </FormData>
  );
}

const FormData = styled.form`
  background: ${(props) => props.theme.accentBgColor};
  display: flex;

  flex: 0.4;
  flex-direction: column;
  gap: 20px;
  height: fit-content;
  padding: 20px 20px;
  border-radius: 10px;

  label {
    font-size: 1.3rem;
  }

  .button {
    height: 40px;
    font-weight: 700;
  }

  .submit.button {
    font-size: 1.6rem;
    height: 48px;
  }

  @media (min-width: 1023px) {
    max-width: 360px;
  }
`;

const DataWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 628px) and (max-width: 1023px) {
    flex-direction: row;
  }
`;

const Data = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  input {
    width: 100%;
    border: none;
    border-radius: 5px;
    height: 40px;

    font-size: 1.2rem;
    padding: 0 10px;
    background: ${(props) => props.theme.inputBgColor};

    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
      width: 20px;
      height: 20px;
      padding-left: 100px;
    }
  }

  .add-employee {
    display: flex;
    gap: 10px;
  }

  .button.add {
    width: 100px;
    font-size: 1.5rem;
  }

  .errorMsg {
    color: #e70000;
    // font-weight: bold;
    font-size: 1.5rem;
  }
`;

const EmployeeList = styled.div`
  height: 150px;
  background: ${(props) => props.theme.inputBgColor};
  padding: 10px;

  display: flex;
  flex-direction: column;

  border-radius: 10px;
  gap: 8px;

  p {
    font-size: 1.4rem;
  }

  .list-name {
    color: #262624;
  }

  ul {
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-right: 10px;
  }

  ul::-webkit-scrollbar {
    width: 12px;
  }

  ul::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.accentColor};
    border-radius: 10px;
  }

  ul::-webkit-scrollbar-track {
    background: ${(props) => props.theme.scrollColor};
    border-radius: 10px;
  }
`;

const EmployeeListItem = styled.li<{ bg_color: string }>`
  width: fit-content;
  display: flex;
  align-items: center;
  padding: 4px 5px 4px 9px;
  border-radius: 50px;
  gap: 0px;
  background-color: ${(props) => props.bg_color};

  p {
    margin-top: 3px;
    line-height: 1.2;
  }

  button {
    padding: 0;
    background: transparent;

    img {
      width: 14px;
      height: 14px;
    }
  }
`;
