class Solution {
    vector<string> out;
    string path;
    void go(const string& digits, int i) {
        static const string KEYS[] = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
        if (i == (int)digits.size()) { out.push_back(path); return; }
        for (char ch : KEYS[digits[i] - '0']) {
            path.push_back(ch);                             // choose
            go(digits, i + 1);                              // explore
            path.pop_back();                                // un-choose
        }
    }
public:
    vector<string> letterCombinations(string digits) {
        if (!digits.empty()) go(digits, 0);
        return out;
    }
};
