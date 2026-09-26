class Solution {
public:
    ListNode* reverseBetween(ListNode* head, int left, int right) {
        vector<int> vals;
        for (ListNode* p = head; p; p = p->next) vals.push_back(p->val);
        reverse(vals.begin() + left - 1, vals.begin() + right);
        int i = 0;
        for (ListNode* p = head; p; p = p->next) p->val = vals[i++];
        return head;
    }
};
