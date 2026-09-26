class Solution {
public:
    void reverseString(vector<char>& s) {
        vector<char> copy(s.rbegin(), s.rend());
        for (size_t i = 0; i < s.size(); i++) s[i] = copy[i];
    }
};
