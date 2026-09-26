class Solution {
public:
    vector<string> letterCombinations(string digits) {
        static const string KEYS[] = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
        if (digits.empty()) return {};
        vector<string> cur{""};
        for (char d : digits) {
            vector<string> next;
            for (auto& p : cur) for (char ch : KEYS[d - '0']) next.push_back(p + ch);
            cur = next;
        }
        return cur;
    }
};
