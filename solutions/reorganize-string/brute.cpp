class Solution {
    int cnt[26] = {0};
    string out;
    bool place(size_t n) {
        if (out.size() == n) return true;
        for (int c = 0; c < 26; c++) {
            if (cnt[c] == 0 || (!out.empty() && out.back() == 'a' + c)) continue;
            cnt[c]--;
            out.push_back('a' + c);
            if (place(n)) return true;
            out.pop_back();                             // undo
            cnt[c]++;
        }
        return false;
    }
public:
    string reorganizeString(string s) {
        for (char c : s) cnt[c - 'a']++;
        return place(s.size()) ? out : "";
    }
};
