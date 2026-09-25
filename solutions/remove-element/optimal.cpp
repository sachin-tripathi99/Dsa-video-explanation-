class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        int k = 0;                              // next write position
        for (int x : nums) {
            if (x != val) nums[k++] = x;        // keep it
        }
        return k;
    }
};
