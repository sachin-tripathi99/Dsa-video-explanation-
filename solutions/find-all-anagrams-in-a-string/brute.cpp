class Solution {
public:
    vector<int> findAnagrams(string s, string p) {
        vector<int> out;
        size_t k = p.size();
        sort(p.begin(), p.end());
        for (size_t i = 0; i + k <= s.size(); i++) {
            string w = s.substr(i, k);
            sort(w.begin(), w.end());
            if (w == p) out.push_back(i);
        }
        return out;
    }
};
