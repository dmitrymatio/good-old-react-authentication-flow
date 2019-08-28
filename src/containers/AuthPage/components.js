import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  text-align: center;
  padding: 170px 0;
  background: #fafafb;
  height: 100vh;
  -webkit-font-smoothing: antialiased;

  > div {
    min-width: 300px;
    text-align: center;
  }

  .input-wrapper {
    padding-top: 30px;
    text-align: left;
  }
`;

export { Wrapper };
