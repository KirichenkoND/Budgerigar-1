

export const EditorMode: React.FC = () => {
    return (
        <>

            <div>
                Новый пациент
                <ul>
                    <li>
                        <label>Фамилия:</label>
                        <input type="text"></input>
                    </li>
                    <li>
                        <label>Имя:</label>
                        <input type="text"></input>
                    </li>
                    <li>
                        <label>Отчество:</label>
                        <input type="text"></input>
                    </li>
                    <li>
                        <label>Дата рождения:</label>
                        <input type="text"></input>
                    </li>
                </ul>
            </div>

            <div>
                Новый Врач
                <ul>
                    <li>
                        <label>Фамилия:</label>
                        <input type="text"></input>
                    </li>
                    <li>
                        <label>Имя:</label>
                        <input type="text"></input>
                    </li>
                    <li>
                        <label>Отчество:</label>
                        <input type="text"></input>
                    </li>
                    <li>
                        <label>Дата рождения:</label>
                        <input type="text"></input>
                    </li>
                    <li>
                        <label>Категория:</label>
                        <input type="text"></input>
                    </li>
                    <li>
                        <label>Специализация:</label>
                        <input type="text"></input>
                    </li>
                    <li>
                        <label>Стаж:</label>
                        <input type="text"></input>
                    </li>
                </ul>
            </div>
            
        </>
    )
}