import { useState } from "react";

import { mockCustomers, generateCustomerId } from "./mockData";
import CustomerCard from "./components/CustomerCard";
import SearchBar from "./components/SearchBar";
import CustomerDetail from "./components/CustomerDetail";

import "./App.css";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  tags: [],
  status: "active",
};

const ALL_TAGS = ["VIP", "Lead", "Referral"];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState(mockCustomers);
  // don't do this
  // const [filterCustomers, setFilteredCustomers] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Derived state
  const filteredCustomers = customers.filter((c) =>
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleChange = (e) => {
    // [e.target.name] evaluates to the value e.g. firstName: "a"
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDeleteCustomer = (customerId) => {
    setCustomers(customers.filter((c) => c.id !== customerId));
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer(null);
    }
  };

  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      // Set tags based on whether the tag is already included in the form's tags array
      // prev.tags.includes(tag) means the tag is already selected
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleAddCustomer = (e) => {
    // Prevent the page from reloading
    e.preventDefault();

    // Create the new customer object to be added
    const newCustomer = {
      id: generateCustomerId(),
      // firstName: firstName
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: "",
      status: form.status,
      tags: form.tags,
      company: "",
      notes: "",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    // Update the state customers with the new customer
    setCustomers([...customers, newCustomer]);

    // Clear the form
    setForm(INITIAL_FORM);
  };

  return (
    <div className="simple-crm">
      <h1>Simple CRM</h1>

      <button
        className="toggle-form-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add Customer"}
      </button>

      {showForm && (
        <form onSubmit={handleAddCustomer} className="add-customer-form">
          <h3>Add New Customer</h3>
          <div className="form-field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="e.g. Sarah"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="e.g. Chen"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. sarah.chen@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Tags</label>
            <div className="tag-options">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`tag-toggle${form.tags.includes(tag) ? " tag-toggle-active" : ""}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="submit-button">
            Add Customer
          </button>
        </form>
      )}

      <div className="crm-layout">
        <div className="customer-panel">
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />

          <div className="customer-list">
            <h2>Customers ({filteredCustomers.length})</h2>

            {filteredCustomers.length === 0 ? (
              <p className="empty-state">
                {searchTerm
                  ? "No customers match your search."
                  : "No customers yet. Add one above!"}
              </p>
            ) : (
              <div className="customers">
                {filteredCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onDelete={handleDeleteCustomer}
                    onSelect={setSelectedCustomer}
                    isSelected={selectedCustomer?.id === customer.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <CustomerDetail customer={selectedCustomer} />
      </div>
    </div>
  );
}

export default App;
