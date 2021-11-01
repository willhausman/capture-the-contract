interface Props {
  name: string;
  children?: any;
  send?: any;
  call?: any;
}

const ContractMethod = ({
  children, name, send, call,
}: Props) => (
  <fieldset style={{ width: '30%' }}>
    <legend>{name}</legend>
    {children}
    {children ? <br /> : ''}
    {send ? <button onClick={send} type="button">send</button> : ''}
    {call ? <button onClick={call} type="button">call</button> : ''}
  </fieldset>
);

export default ContractMethod;
