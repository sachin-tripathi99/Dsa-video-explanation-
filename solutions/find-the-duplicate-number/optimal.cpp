class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int slow = nums[0], fast = nums[nums[0]];
        while (slow != fast) {                    // phase 1: meet inside the cycle
            slow = nums[slow];
            fast = nums[nums[fast]];
        }
        slow = 0;
        while (slow != fast) {                    // phase 2: meet at the cycle entrance
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
};
