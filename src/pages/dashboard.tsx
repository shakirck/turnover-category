import { api } from "~/utils/api"

export default function Dashboard(){
    const myquery = api.categories.getCategories.useQuery({user_id:1})
    const categories = myquery.data

    return (
        <div>
            Dashboard 
            <div>
                {categories?.map((category) => (
                    <div key={category.id}>
                        {category.name}
                    </div>
                ))}
                </div>
        </div>
    )
}