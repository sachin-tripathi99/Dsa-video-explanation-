class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        ListNode* cur = head;
        while (cur && cur->next) {
            if (cur->next->val == cur->val) cur->next = cur->next->next;   // unlink the duplicate
            else cur = cur->next;                                           // only move on when different
        }
        return head;
    }
};
