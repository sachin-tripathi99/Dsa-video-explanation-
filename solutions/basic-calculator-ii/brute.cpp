class Solution {
public:
    int calculate(string s) {
        vector<long long> nums;
        vector<char> ops;
        long long num = 0;
        for (char c : s) {
            if (isdigit((unsigned char)c)) num = num * 10 + (c - '0');
            else if (c == '+' || c == '-' || c == '*' || c == '/') { nums.push_back(num); ops.push_back(c); num = 0; }
        }
        nums.push_back(num);
        vector<long long> terms = {nums[0]};                     // pass 1: fold × and ÷
        vector<char> addOps;
        for (size_t i = 0; i < ops.size(); i++) {
            long long n = nums[i + 1];
            if (ops[i] == '*') terms.back() *= n;
            else if (ops[i] == '/') terms.back() /= n;
            else { addOps.push_back(ops[i]); terms.push_back(n); }
        }
        long long total = terms[0];                              // pass 2: + and −
        for (size_t i = 0; i < addOps.size(); i++) total = addOps[i] == '+' ? total + terms[i + 1] : total - terms[i + 1];
        return (int)total;
    }
};
