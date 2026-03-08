


import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { FaEnvelope, FaPhone } from "react-icons/fa";

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(
          collection(db, "contactMessages"),
          orderBy("createdAt", "desc"),
          limit(100)
        );
        const querySnapshot = await getDocs(q);

        const fetchedMessages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const toggleMessage = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div
      className="container-fluid py-4"
      style={{
        position: "relative",
        zIndex: 1,
        marginTop: "90px",
      }}
    >
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">📩 Contact Messages</h5>
          <span className="badge bg-warning text-dark">
            {messages.length} Messages
          </span>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning mb-2" />
              <p className="mb-0">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No contact messages found
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th style={{ width: "35%" }}>Message</th>
                    <th>Received</th>
                  </tr>
                </thead>

                <tbody>
                  {messages.map((msg) => {
                    const isExpanded = expandedId === msg.id;
                    const preview =
                      msg.message.length > 120
                        ? msg.message.slice(0, 120) + "..."
                        : msg.message;

                    return (
                      <tr key={msg.id}>
                        <td className="fw-semibold">{msg.name}</td>

                        <td>
                          <FaEnvelope className="me-1 text-muted" />
                          {msg.email}
                        </td>

                        <td>
                          <FaPhone className="me-1 text-muted" />
                          {msg.mobile}
                        </td>

                        <td>
                          <div
                            style={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {isExpanded ? msg.message : preview}
                          </div>

                          {msg.message.length > 120 && (
                            <button
                              onClick={() => toggleMessage(msg.id)}
                              className="btn btn-link btn-sm p-0 mt-1"
                            >
                              {isExpanded ? "View less" : "View more"}
                            </button>
                          )}
                        </td>

                        <td className="small text-muted">
                          {msg.createdAt?.toDate().toLocaleString() || "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContactMessages;
