class Solution {
public:
    string removeKdigits(string num, int k) {
        string s = num;
        for (int r = 0; r < k; r++) {
            size_t i = 0;
            while (i + 1 < s.size() && s[i] <= s[i + 1]) i++;    // first peak
            s.erase(i, 1);
        }
        size_t z = s.find_first_not_of('0');
        return z == string::npos ? "0" : s.substr(z);
    }
};
