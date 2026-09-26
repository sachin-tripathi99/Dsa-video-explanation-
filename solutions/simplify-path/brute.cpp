class Solution {
public:
    string simplifyPath(string path) {
        vector<string> parts;
        string cur;
        for (char c : path + "/") {
            if (c == '/') { parts.push_back(cur); cur.clear(); }
            else cur += c;
        }
        bool changed = true;
        while (changed) {                                   // rewrite until nothing changes
            changed = false;
            vector<string> clean;
            for (auto& p : parts) if (p != "" && p != ".") clean.push_back(p);
            if (clean.size() != parts.size()) { parts = clean; changed = true; }
            for (size_t i = 0; i < parts.size(); i++)
                if (parts[i] == "..") {
                    parts.erase(parts.begin() + i);
                    if (i > 0) parts.erase(parts.begin() + i - 1);
                    changed = true;
                    break;
                }
        }
        string out;
        for (auto& p : parts) out += "/" + p;
        return out.empty() ? "/" : out;
    }
};
