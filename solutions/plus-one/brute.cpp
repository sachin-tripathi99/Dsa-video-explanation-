class Solution {
public:
    vector<int> plusOne(vector<int>& digits) {
        long long x = 0;
        for (int d : digits) x = x * 10 + d;     // overflows beyond ~18 digits
        x += 1;
        string s = to_string(x);
        vector<int> out;
        for (char c : s) out.push_back(c - '0');
        return out;
    }
};
