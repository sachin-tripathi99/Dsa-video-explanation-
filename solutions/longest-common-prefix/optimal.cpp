class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        const string& first = strs[0];
        for (size_t i = 0; i < first.size(); i++) {
            for (auto& w : strs) {
                if (i == w.size() || w[i] != first[i]) return first.substr(0, i);  // column mismatch
            }
        }
        return first;
    }
};
