import Input from '../../UI/Input/Input';

const PatientFields = [
    { label: "Фамилия:", type: "text" },
    { label: "Имя:", type: "text" },
    { label: "Отчество:", type: "text" },
    { label: "Дата рождения:", type: "text" },
]

const doctorFields = [
    { label: "Фамилия:", type: "text" },
    { label: "Имя:", type: "text" },
    { label: "Отчество:", type: "text" },
    { label: "Дата рождения:", type: "text" },
    { label: "Категория:", type: "text" },
    { label: "Специализация:", type: "text" },
    { label: "Стаж:", type: "text" },
];

export const EditorMode: React.FC = () => {
    return (
        <>

            <div>
                Новый пациент
                <ul>
                    {
                        PatientFields.map((field, index) => (
                            <li key={index}>
                                <label>{field.label}</label>
                                <Input />
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div>
                Новый Врач
                <ul>
                    {
                        doctorFields.map((field, index) => (
                            <li key={index}>
                                <label>{field.label}</label>
                                <Input />
                            </li>
                        ))
                    }
                </ul>
            </div>

        </>
    )
}