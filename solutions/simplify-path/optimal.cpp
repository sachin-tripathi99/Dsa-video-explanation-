class Solution {
public:
    string simplifyPath(string path) {
        vector<string> st;
        stringstream ss(path);
        string part;
        while (getline(ss, part, '/')) {
            if (part.empty() || part == ".") continue;
            if (part == "..") { if (!st.empty()) st.pop_back(); }   // go up one folder
            else st.push_back(part);
        }
        string out;
        for (auto& p : st) out += "/" + p;
        return out.empty() ? "/" : out;
    }
};
