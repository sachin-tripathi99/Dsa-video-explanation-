class Solution {
public:
    vector<int> plusOne(vector<int>& digits) {
        for (int i = (int)digits.size() - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;                     // no carry: done
                return digits;
            }
            digits[i] = 0;                       // 9 + 1 = 10: write 0, carry 1
        }
        digits.insert(digits.begin(), 1);        // all digits were 9
        return digits;
    }
};
