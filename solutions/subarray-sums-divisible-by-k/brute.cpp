class Solution {
public:
    int subarraysDivByK(vector<int>& nums, int k) {
        int count = 0, n = nums.size();
        for (int i = 0; i < n; i++) {
            int s = 0;
            for (int j = i; j < n; j++) {
                s += nums[j];
                if (s % k == 0) count++;
            }
        }
        return count;
    }
};
