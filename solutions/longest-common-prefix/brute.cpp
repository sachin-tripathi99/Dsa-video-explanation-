class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        string prefix = strs[0];
        for (auto& w : strs) {
            while (w.compare(0, prefix.size(), prefix) != 0) prefix.pop_back();
        }
        return prefix;
    }
};
