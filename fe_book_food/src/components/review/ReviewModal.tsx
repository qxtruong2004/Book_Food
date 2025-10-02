import { useEffect, useState } from "react";
import { Stars } from "./Star";

type Props ={
    show: boolean;
    onClose: () =>void;
    onSubmit: (rating: number, comment?: string) => Promise<void>|void;
    foodName: string;
}

const ReviewModal: React.FC<Props> = ({show, onClose, onSubmit, foodName}) => {
    const [rating, setRating] = useState(5);
    const[comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    //Reset khi mở modal
    useEffect(() =>{
        if(show){
            //reset mỗi lần mở
            setRating(1);
            setComment("");
            setSubmitting(false);
        }
    }, [show])

    if(!show) return null;
    return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={async e => {
            e.preventDefault();
            setSubmitting(true);
            try { await onSubmit(rating, comment); }
            finally { setSubmitting(false); }
          }}>
            <div className="modal-header">
              <h5 className="modal-title">Đánh giá món: {foodName}</h5>
              <button type="button" className="btn-close" onClick={onClose}/>
            </div>

            <div className="modal-body">
              <label className="form-label">Đánh giá</label>
              <Stars value={rating} onChange={setRating}/>
              <label className="form-label mt-3">Cảm nhận của bạn về món ăn</label>
              <textarea
                className="form-control"
                rows={3}
                maxLength={500}
                value={comment}
                onChange={e=>setComment(e.target.value)}
                placeholder="Hương vị, độ nóng, đóng gói, v.v."
              />
              <small className="text-muted">Tối đa 500 ký tự.</small>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={submitting}>
                Huỷ
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
