class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        int len = 0;
        for (ListNode* p = head; p; p = p->next) len++;
        ListNode dummy(0, head);
        ListNode* p = &dummy;
        for (int i = 0; i < len - n; i++) p = p->next;
        p->next = p->next->next;
        return dummy.next;
    }
};
