import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Bluetooth,
  Check,
  MapPin,
  Pencil,
  Settings2,
  Shield,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  useAddContact,
  useDeleteContact,
  useListContacts,
  useUpdateContact,
} from "../hooks/useQueries";

interface LocalContact {
  id: string;
  name: string;
  phoneNumber: string;
}

const INITIAL_CONTACTS: LocalContact[] = [
  { id: "1", name: "Juan dela Cruz", phoneNumber: "+63 912 345 6789" },
  { id: "2", name: "Maria Santos", phoneNumber: "+63 917 987 6543" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Settings() {
  const [localContacts, setLocalContacts] =
    useState<LocalContact[]>(INITIAL_CONTACTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [btAutoConnect, setBtAutoConnect] = useState(true);
  const [gpsTracking, setGpsTracking] = useState(true);
  const [crashDetection, setCrashDetection] = useState(true);

  const contactsQuery = useListContacts();
  const addContact = useAddContact();
  const deleteContact = useDeleteContact();
  const updateContact = useUpdateContact();

  const useBackend =
    !contactsQuery.isError &&
    !!contactsQuery.data &&
    contactsQuery.data.length >= 0 &&
    !contactsQuery.isLoading;
  const backendContacts = contactsQuery.data ?? [];

  const contacts: LocalContact[] = useBackend
    ? backendContacts.map((c) => ({
        id: String(c.id),
        name: c.name,
        phoneNumber: c.phoneNumber,
      }))
    : localContacts;

  const handleAdd = async () => {
    if (!formName.trim() || !formPhone.trim()) return;
    if (useBackend) {
      await addContact.mutateAsync({
        name: formName.trim(),
        phoneNumber: formPhone.trim(),
      });
    } else {
      setLocalContacts((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: formName.trim(),
          phoneNumber: formPhone.trim(),
        },
      ]);
    }
    setFormName("");
    setFormPhone("");
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (useBackend) {
      await deleteContact.mutateAsync(BigInt(id));
    } else {
      setLocalContacts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleEdit = (contact: LocalContact) => {
    setEditingId(contact.id);
    setFormName(contact.name);
    setFormPhone(contact.phoneNumber);
    setShowAddForm(false);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !formName.trim() || !formPhone.trim()) return;
    if (useBackend) {
      await updateContact.mutateAsync({
        id: BigInt(editingId),
        contact: { name: formName.trim(), phoneNumber: formPhone.trim() },
      });
    } else {
      setLocalContacts((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, name: formName.trim(), phoneNumber: formPhone.trim() }
            : c,
        ),
      );
    }
    setEditingId(null);
    setFormName("");
    setFormPhone("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormName("");
    setFormPhone("");
  };

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: "oklch(0.10 0 0)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 pt-4 pb-3"
        style={{ borderBottom: "1px solid oklch(0.22 0 0)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "oklch(0.75 0.18 70 / 0.15)" }}
        >
          <Settings2
            className="w-4 h-4"
            style={{ color: "oklch(0.75 0.18 70)" }}
          />
        </div>
        <div>
          <h1
            className="font-display text-sm font-bold tracking-widest uppercase"
            style={{ color: "oklch(0.75 0.18 70)" }}
          >
            Settings
          </h1>
          <p className="text-xs" style={{ color: "oklch(0.62 0.01 240)" }}>
            Manage your device
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 py-3 space-y-5">
        {/* Emergency Contacts */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Emergency Contacts
              </h2>
              <p className="text-xs" style={{ color: "oklch(0.62 0.01 240)" }}>
                Notified during SOS events
              </p>
            </div>
            {contactsQuery.isLoading && (
              <span
                className="text-xs"
                style={{ color: "oklch(0.62 0.01 240)" }}
                data-ocid="contacts.loading_state"
              >
                Loading...
              </span>
            )}
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.16 0 0)",
              border: "1px solid oklch(0.22 0 0)",
            }}
          >
            <AnimatePresence>
              {contacts.length === 0 ? (
                <div
                  className="p-6 text-center"
                  data-ocid="contacts.empty_state"
                >
                  <p
                    className="text-sm"
                    style={{ color: "oklch(0.62 0.01 240)" }}
                  >
                    No emergency contacts added
                  </p>
                </div>
              ) : (
                contacts.map((contact, i) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    data-ocid={`contacts.item.${i + 1}`}
                  >
                    {editingId === contact.id ? (
                      <div
                        className="p-3 space-y-2"
                        style={{
                          borderBottom:
                            i < contacts.length - 1
                              ? "1px solid oklch(0.22 0 0)"
                              : "none",
                        }}
                      >
                        <Input
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Name"
                          className="h-8 text-sm"
                          style={{
                            background: "oklch(0.10 0 0)",
                            border: "1px solid oklch(0.30 0 0)",
                          }}
                          data-ocid="contacts.input"
                        />
                        <Input
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          placeholder="Phone"
                          className="h-8 text-sm"
                          style={{
                            background: "oklch(0.10 0 0)",
                            border: "1px solid oklch(0.30 0 0)",
                          }}
                          data-ocid="contacts.input"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold"
                            style={{
                              background: "oklch(0.75 0.18 70)",
                              color: "#000",
                            }}
                            data-ocid="contacts.save_button"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold"
                            style={{
                              background: "oklch(0.22 0 0)",
                              color: "oklch(0.62 0.01 240)",
                            }}
                            data-ocid="contacts.cancel_button"
                          >
                            <X className="w-3 h-3" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex items-center gap-3 px-4 py-3"
                        style={{
                          borderBottom:
                            i < contacts.length - 1
                              ? "1px solid oklch(0.22 0 0)"
                              : "none",
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{
                            background: "oklch(0.75 0.18 70 / 0.15)",
                            color: "oklch(0.75 0.18 70)",
                          }}
                        >
                          {getInitials(contact.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {contact.name}
                          </p>
                          <p
                            className="text-xs truncate"
                            style={{ color: "oklch(0.62 0.01 240)" }}
                          >
                            {contact.phoneNumber}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEdit(contact)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: "oklch(0.75 0.18 70 / 0.1)" }}
                            data-ocid={`contacts.edit_button.${i + 1}`}
                          >
                            <Pencil
                              className="w-3.5 h-3.5"
                              style={{ color: "oklch(0.75 0.18 70)" }}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(contact.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{
                              background: "oklch(0.63 0.24 25 / 0.1)",
                            }}
                            data-ocid={`contacts.delete_button.${i + 1}`}
                          >
                            <Trash2
                              className="w-3.5 h-3.5"
                              style={{ color: "oklch(0.63 0.24 25)" }}
                            />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 rounded-2xl p-3 space-y-2"
                style={{
                  background: "oklch(0.16 0 0)",
                  border: "1px solid oklch(0.75 0.18 70 / 0.3)",
                }}
                data-ocid="contacts.dialog"
              >
                <Label
                  className="text-xs font-semibold"
                  style={{ color: "oklch(0.75 0.18 70)" }}
                >
                  New Contact
                </Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Full Name"
                  className="h-9 text-sm"
                  style={{
                    background: "oklch(0.10 0 0)",
                    border: "1px solid oklch(0.30 0 0)",
                  }}
                  data-ocid="contacts.input"
                />
                <Input
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="Phone Number"
                  type="tel"
                  className="h-9 text-sm"
                  style={{
                    background: "oklch(0.10 0 0)",
                    border: "1px solid oklch(0.30 0 0)",
                  }}
                  data-ocid="contacts.input"
                />
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={handleAdd}
                    disabled={addContact.isPending}
                    className="flex-1 h-9 text-sm font-semibold"
                    style={{ background: "oklch(0.75 0.18 70)", color: "#000" }}
                    data-ocid="contacts.submit_button"
                  >
                    {addContact.isPending ? "Saving..." : "Save Contact"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setFormName("");
                      setFormPhone("");
                    }}
                    className="flex-1 h-9 text-sm"
                    data-ocid="contacts.cancel_button"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showAddForm && editingId === null && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full mt-2 h-10 font-semibold text-sm gap-2"
              style={{ background: "oklch(0.75 0.18 70)", color: "#000" }}
              data-ocid="contacts.open_modal_button"
            >
              <UserPlus className="w-4 h-4" />
              Add Contact
            </Button>
          )}
        </section>

        {/* Device Settings */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Device Settings
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.16 0 0)",
              border: "1px solid oklch(0.22 0 0)",
            }}
          >
            {[
              {
                label: "Bluetooth Auto-Connect",
                icon: Bluetooth,
                value: btAutoConnect,
                onChange: setBtAutoConnect,
                id: "bt_autoconnect",
              },
              {
                label: "GPS Tracking",
                icon: MapPin,
                value: gpsTracking,
                onChange: setGpsTracking,
                id: "gps_tracking",
              },
              {
                label: "Crash Detection",
                icon: Shield,
                value: crashDetection,
                onChange: setCrashDetection,
                id: "crash_detection",
              },
            ].map((setting, i) => (
              <div
                key={setting.id}
                className="flex items-center justify-between px-4 py-3.5"
                style={{
                  borderBottom: i < 2 ? "1px solid oklch(0.22 0 0)" : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <setting.icon
                    className="w-4 h-4"
                    style={{ color: "oklch(0.75 0.18 70)" }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {setting.label}
                  </span>
                </div>
                <Switch
                  checked={setting.value}
                  onCheckedChange={setting.onChange}
                  data-ocid={`settings.${setting.id}.switch`}
                />
              </div>
            ))}
          </div>
        </section>

        <div className="text-center pb-4">
          <p className="text-xs" style={{ color: "oklch(0.40 0 0)" }}>
            Guardian Gauntlet v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
