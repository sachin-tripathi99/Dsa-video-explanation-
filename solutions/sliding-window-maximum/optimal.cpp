class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq;                                      // indices, values decreasing
        vector<int> out;
        for (int i = 0; i < (int)nums.size(); i++) {
            if (!dq.empty() && dq.front() <= i - k) dq.pop_front();            // too old
            while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();   // useless
            dq.push_back(i);
            if (i >= k - 1) out.push_back(nums[dq.front()]);
        }
        return out;
    }
};
