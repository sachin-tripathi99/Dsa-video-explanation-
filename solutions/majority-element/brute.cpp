class Solution {
public:
    int majorityElement(vector<int>& nums) {
        for (int x : nums) {
            int count = 0;
            for (int y : nums) if (y == x) count++;
            if (count > (int)nums.size() / 2) return x;
        }
        return -1;
    }
};
