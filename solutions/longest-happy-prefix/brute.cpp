class Solution {
public:
    string longestPrefix(string s) {
        int n = s.size();
        for (int len = n - 1; len > 0; len--)
            if (s.compare(0, len, s, n - len, len) == 0) return s.substr(0, len);   // prefix equals suffix
        return "";
    }
};
