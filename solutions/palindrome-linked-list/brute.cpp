class Solution {
public:
    bool isPalindrome(ListNode* head) {
        vector<int> vals;
        for (ListNode* p = head; p; p = p->next) vals.push_back(p->val);
        return equal(vals.begin(), vals.end(), vals.rbegin());
    }
};
