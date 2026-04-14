interface ButtonComponent<T = void>{
    Action:(args:T)=>void,
    actionArgs?: T; 
    className:string,
    disabled:boolean,
    title:string
}
export default function Button<T=void>({Action,actionArgs,className,disabled,title}:ButtonComponent<T>)
{
    return(
        <button onClick={() => Action(actionArgs as T)} className={`${className} ${!disabled? 'hover: scale-110 hover:font-black duration-300 ease-in-out':''}`} disabled={disabled}>{title}</button>
    )
}