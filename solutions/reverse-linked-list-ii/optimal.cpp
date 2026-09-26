class Solution {
public:
    ListNode* reverseBetween(ListNode* head, int left, int right) {
        ListNode dummy(0, head);
        ListNode* before = &dummy;
        for (int i = 1; i < left; i++) before = before->next;
        ListNode* after = before->next;
        for (int i = left; i <= right; i++) after = after->next;     // node after the piece
        ListNode *prev = after, *cur = before->next;
        for (int i = left; i <= right; i++) {                        // reverse the piece
            ListNode* next = cur->next;
            cur->next = prev;
            prev = cur;
            cur = next;
        }
        before->next = prev;                                         // reconnect the front
        return dummy.next;
    }
};
