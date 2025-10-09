import { useEffect, useState } from "react";

interface Props {
    initialValue: string;
    placeholder?: string;
    onSearch: (keyword: string) => void,
    onClear?: () => void;
    debounceMs?: number; //Nếu >0, tự động search sau khi ngừng gõ (tránh gọi API liên tục). ( mặc định = 0)
    showButtons?: boolean; /** Hiển thị nút Tìm/Xoá (khi debounce=0 thì nên để true) */
    inputMaxWidth?: number; /** maxWidth cho input (mặc định 320px) */
}

const SearchBar: React.FC<Props> = ({ initialValue = "", placeholder= "Tìm kiếm..." ,onSearch, onClear, debounceMs= 0, showButtons= true, inputMaxWidth=320 }) => {
    const [kw, setKw] = useState(initialValue);

    // Debounce: khi debounceMs > 0 thì tự onSearch sau khi dừng gõ
    useEffect(() =>{
        if(!debounceMs) return; //Nếu debounce=0, bỏ qua effect (không tự động search).
        const t = setTimeout(() =>{
            onSearch(kw.trim());
        }, debounceMs);
        return () => clearTimeout(t);
    }, [kw, debounceMs, onSearch]);

    //gọi hàm tìm kiếm
    const submit = (e?: React.FormEvent) => {
        e?.preventDefault();  // Ngăn submit form mặc định (reload trang), dùng optional chaining nếu e undefined.
        if (debounceMs) return; //Nếu có debounce, không gọi onSearch (để effect xử lý tự động)
        onSearch(kw.trim());
    }

    const clear = () => {
        setKw("");
        onClear?.();
        onSearch(""); //trả về full list
    }

    return (
        <form className="d-flex align-items-center gap-2" onSubmit={submit}>
            <input value={kw} onChange={(e) => setKw(e.target.value)}
                placeholder={placeholder}
                className="form-control"
                style={{ maxWidth: inputMaxWidth }} />
             {showButtons && (
            <>
                <button type="submit" className="btn btn-success">Tìm</button>
                <button type="button" className="btn btn-outline-secondary" onClick={clear}>Xoá</button>
            </>
        )}
        </form>
    )
}

export default SearchBar;