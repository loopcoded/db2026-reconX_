package com.dbtraining.reconx.controller;

import com.dbtraining.reconx.dto.ReconRunRequest;
import com.dbtraining.reconx.repository.ReconBreakRepository;
import com.dbtraining.reconx.repository.TradeRepository;
import com.dbtraining.reconx.repository.entity.ReconBreak;
import com.dbtraining.reconx.repository.entity.Trade;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ReconControllerTest {

    @Mock
    private ReconBreakRepository breaksRepo;

    @Mock
    private TradeRepository tradeRepo;

    @InjectMocks
    private ReconController reconController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRunRecon_createsBreaksForUnmatchedTrades() {
        Trade unmatchedTrade = new Trade();
        ReflectionTestUtils.setField(unmatchedTrade, "id", 1L);
        unmatchedTrade.setStatus("UNMATCHED");
        
        when(tradeRepo.findAll()).thenReturn(List.of(unmatchedTrade));
        when(breaksRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ReconRunRequest req = new ReconRunRequest(LocalDate.now(), LocalDate.now(), null);
        ResponseEntity<Map<String, String>> response = reconController.runRecon(req);

        assertEquals(202, response.getStatusCode().value());
        assertTrue(response.getBody().containsKey("jobId"));
        verify(breaksRepo, times(1)).save(any(ReconBreak.class));
    }

    @Test
    void testResults_returnsAllBreaks() {
        ReconBreak rb = new ReconBreak();
        ReflectionTestUtils.setField(rb, "id", 10L);
        when(breaksRepo.findAll()).thenReturn(List.of(rb));

        List<ReconBreak> result = reconController.results("job123");
        assertEquals(1, result.size());
        assertEquals(10L, result.get(0).getId());
    }

    @Test
    void testResolve_resolvesBreak() {
        ReconBreak rb = new ReconBreak();
        ReflectionTestUtils.setField(rb, "id", 10L);
        ReflectionTestUtils.setField(rb, "status", "OPEN");
        when(breaksRepo.findById(10L)).thenReturn(Optional.of(rb));
        when(breaksRepo.save(any())).thenReturn(rb);

        ResponseEntity<ReconBreak> response = reconController.resolve(10L, Map.of("note", "fixed it"));
        assertEquals(200, response.getStatusCode().value());
        assertEquals("RESOLVED", response.getBody().getStatus());
        assertEquals("fixed it", response.getBody().getResolutionNote());
    }
}
