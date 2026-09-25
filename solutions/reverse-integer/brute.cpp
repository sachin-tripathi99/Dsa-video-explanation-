class Solution {
public:
    int reverse(int x) {
        string digits = to_string(llabs((long long) x));
        std::reverse(digits.begin(), digits.end());
        long long r = stoll(digits) * (x < 0 ? -1 : 1);
        if (r > INT_MAX || r < INT_MIN) return 0;
        return (int) r;
    }
};
