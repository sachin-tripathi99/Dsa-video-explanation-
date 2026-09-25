class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        ListNode dummy(0, head);
        ListNode* prev = &dummy;
        while (prev->next) {
            if (prev->next->val == val) prev->next = prev->next->next;   // unlink
            else prev = prev->next;
        }
        return dummy.next;
    }
};
