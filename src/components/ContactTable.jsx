import { useSelector, useDispatch } from "react-redux";
import { deleteContact, setEditingContact } from "../redux/contactSlice";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { format, parseISO } from "date-fns";

export default function ContactTable() {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contacts.contacts);

  const [search, setSearch] = useState(""); // Global search state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(1);

  // Apply global search across all contact fields before pagination
  const filtered = contacts.filter((c) =>
    Object.values(c).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const order = sortConfig.direction === "asc" ? 1 : -1;
    return a[sortConfig.key]?.localeCompare(b[sortConfig.key]) * order;
  });

  const perPage = 10;
  
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filtered);
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");
    XLSX.writeFile(wb, "contacts.xlsx");
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl overflow-auto">
      <div className="flex justify-between mb-4">
        {/* Global Search Input */}
        <input
          placeholder="Search all fields..."
          className="border px-3 py-1 rounded"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Export
        </button>
      </div>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-blue-100">
            {[
              "Name",
              "Email",
              "Phone",
              "Country",
              "City",
              "Appointment Date",
            ].map((col) => (
              <th
                key={col}
                className="p-2 cursor-pointer"
                onClick={() => toggleSort(col.toLowerCase().replace(/ /g, ""))}
              >
                {col}
              </th>
            ))}
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paged.map((contact) => (
            <tr key={contact.id} className="border-t">
              <td className="p-2">{contact.name}</td>
              <td className="p-2">{contact.email}</td>
              <td className="p-2">{contact.phone}</td>
              <td className="p-2">{contact.country}</td>
              <td className="p-2">{contact.city}</td>
              {/* <td className="p-2">{contact.appointmentDate}</td> */}
              <td className="p-2">
                {contact.appointmentDate
                  ? format(parseISO(contact.appointmentDate), "dd-MM-yyyy")
                  : ""}
              </td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => dispatch(setEditingContact(contact))}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deleteContact(contact.id))}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        <span>Page {page}</span>
        <button
          disabled={page * perPage >= filtered.length}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
