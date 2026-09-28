class Solution {
public:
    int singleNumber(vector<int>& nums) {
        unsigned result = 0;
        for (int b = 0; b < 32; b++) {
            int c = 0;
            for (int x : nums) c += ((unsigned)x >> b) & 1; // ones in this column
            if (c % 3) result |= 1u << b;                   // the loner's bit
        }
        return (int)result;
    }
};
