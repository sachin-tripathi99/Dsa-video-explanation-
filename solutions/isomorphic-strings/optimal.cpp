class Solution {
public:
    bool isIsomorphic(string s, string t) {
        unordered_map<char, char> st, ts;
        for (size_t i = 0; i < s.size(); i++) {
            char a = s[i], b = t[i];
            if (st.count(a) && st[a] != b) return false;   // a already maps elsewhere
            if (ts.count(b) && ts[b] != a) return false;   // b already taken
            st[a] = b;
            ts[b] = a;
        }
        return true;
    }
};
