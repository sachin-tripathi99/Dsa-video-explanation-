class Solution {
public:
    int singleNumber(vector<int>& nums) {
        for (int x : nums) {
            int count = 0;
            for (int y : nums) if (y == x) count++;         // count each number
            if (count == 1) return x;
        }
        return -1;
    }
};
